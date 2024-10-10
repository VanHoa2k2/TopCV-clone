import HeaderContent from "./HeaderContent";

const Header = () => {
  return (
    <header className="sticky top-0 z-20 px-6 h-[72px] flex items-center justify-between bg-white">
      <HeaderContent />
    </header>
  );
};

export default Header;
