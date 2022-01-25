import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Pages } from '../types/pages';
import { Todo } from '../types/todo';

const pages: Pages = {
  index: { title: 'All Todos', fetchQuery: '' },
  active: { title: 'Active Todos', fetchQuery: '?completed=false' },
  completed: { title: 'Completed Todos', fetchQuery: '?completed=true' },
};

const pageLinks = Object.keys(pages).map((page, index) => (
  <Link href={`/${page === 'index' ? '' : page}`} key={index}>
    <a style={{ marginRight: 10 }}>{pages[page].title}</a>
  </Link>
));

export default function Todos({ page }: { page: string }) {
  const { title, fetchQuery } = pages[page];

  const [todos, setTodos] = React.useState<Todo[]>([]);

  React.useEffect(() => {
    fetch(`/api/todos${fetchQuery}`).then(async (res) =>
      res.ok ? setTodos(await res.json()) : alert(await res.text())
    );
  }, [fetchQuery, page]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inputTextRef = React.useRef<HTMLInputElement>(null!);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <label>
        Add new Todo
        <input ref={inputTextRef} type="text" />
        <button
          onClick={async () => {
            const result: Response = await fetch('/api/todos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title: inputTextRef.current.value }),
            });

            if (result.status === 201) {
              fetch(`/api/todos${fetchQuery}`).then(async (res: Response) => {
                res.ok ? setTodos(await res.json()) : alert(await res.text());
                inputTextRef.current.value = '';
              });
            } else {
              alert(await result.text());
            }
          }}
        >
          Submit
        </button>
      </label>

      <ul>
        {todos.map(({ id, title, completed }) => (
          <li key={id}>
            <span style={completed ? { textDecoration: 'line-through' } : {}}>
              {title}
            </span>
          </li>
        ))}
      </ul>
      <div>{pageLinks}</div>
    </>
  );
}
