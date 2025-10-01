import TodoClient from '../components/TodoClient';
import AuthButton from '../components/AuthButton';

export default function Page() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      }}
    >
      <header
        style={{
          backgroundColor: 'white',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '32px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 8px 0',
                }}
              >
                Todo App
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  fontWeight: '500',
                  margin: 0,
                }}
              >
                Secure SSO with Keycloak
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px',
        }}
      >
        <TodoClient />
      </main>
    </div>
  );
}
