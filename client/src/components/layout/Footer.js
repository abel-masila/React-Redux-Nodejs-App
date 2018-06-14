import React from 'react';

export default () => {
  return (
    <div style={{ marginBottom: '70px' }}>
      <footer className="bg-dark footer text-white text-center fixed-bottom">
        <p>
          Copyright &copy; {new Date().getFullYear()} {'{Connect - Ke}'}{' '}
        </p>
      </footer>
    </div>
  );
};
