import { NavLink, matchPath, useLocation } from 'react-router-dom';

export const Header = () => {
  const { pathname } = useLocation();

  const menuItems = [
    { to: 'bsc', title: 'BSC' },
    { to: 'eth', title: 'Ethereum' },
    { to: 'avax', title: 'Avax' },
  ];

  return (
    <div className="flex items-center px-4 py-4 border-b-2 border-lime-600">
      <h1 className="text-center text-4xl font-bold ">Real GEM 💩</h1>
      <nav className="mx-auto">
        <ul className="flex gap-4">
          {menuItems.map(({ to, title }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className={() => {
                  const additionalClasses = ' bg-lime-600 text-white';
                  const mainClasses =
                    'cursor-pointer inline-flex justify-center py-2 px-4 border border-lime-600 shadow-sm rounded-md text-lime-600 focus:outline-none uppercase';
                  return matchPath(
                    {
                      path: to,
                      end: false,
                    },
                    pathname
                  )
                    ? mainClasses + additionalClasses
                    : mainClasses;
                }}
              >
                {title}
              </NavLink>
            );
          })}
        </ul>
      </nav>
      <button className="ml-auto cursor-pointer inline-flex justify-center py-2 px-4 border border-lime-600 shadow-sm rounded-md text-lime-600 focus:outline-none uppercase hover:bg-lime-600 hover:text-white">
        Connect Wallet
      </button>
    </div>
  );
};
