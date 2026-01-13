interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  return (
    <header className="company-profile-header">
      <h1>{name || 'Nombre de la Empresa'}</h1>
    </header>
  );
};

export default Header;