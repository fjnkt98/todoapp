import { Link } from "@remix-run/react";

export default function AuthCodeError() {
  return (
    <div>
      <h2>Auth Code Error</h2>
      <Link to="/">return to top</Link>
    </div>
  );
}
