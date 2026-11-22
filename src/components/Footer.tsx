type FooterProps = {
  organization: string;
};

export const Footer = ({ organization }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {currentYear} {organization}
      </p>
    </footer>
  );
};