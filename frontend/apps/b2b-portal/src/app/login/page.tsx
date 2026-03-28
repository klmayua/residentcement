import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="portal-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            Resident<span className="accent">Ciment</span> B2B
          </div>
          <Link href="/" className="text-link">
            Return to Portal
          </Link>
        </div>
      </header>

      <main className="main-wrap">
        <div className="auth-wrap">
          <section className="auth-card">
            <div className="eyebrow">Partner Authentication</div>
            <h1 className="hero-title" style={{ fontSize: "34px" }}>
              Sign In
            </h1>
            <p className="hero-text">
              Access your company account for order placement, invoice management, and delivery
              tracking.
            </p>

            <div className="input-group">
              <label htmlFor="email">Business Email</label>
              <input id="email" type="email" placeholder="procurement@company.com" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" />
            </div>

            <div className="auth-actions">
              <button className="toolbar-cta" type="button">
                Sign In
              </button>
              <a className="text-link" href="mailto:partnerships@residentciment.com">
                Need Account Access?
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

