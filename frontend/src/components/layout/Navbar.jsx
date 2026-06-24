import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import { HiOutlineLogout } from 'react-icons/hi';
import { RiFlowChart } from 'react-icons/ri';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon"><RiFlowChart /></span>
        TaskFlow
      </div>

      {user && (
        <div className="navbar-user">
          <span className="user-name">Hey, {user.name?.split(' ')[0]}</span>
          <div className="user-avatar">{getInitials(user.name)}</div>
          <button
            className="btn-icon"
            onClick={logout}
            title="Logout"
            aria-label="Logout"
          >
            <HiOutlineLogout />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
