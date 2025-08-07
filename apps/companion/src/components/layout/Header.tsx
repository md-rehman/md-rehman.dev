import {signOut} from '@/actions/auth'

export const Header = () => {
  return (
    <nav className="flex flex-row justify-between">
      <div className="flex">
        <div className="p-2">Companion</div>
      </div>
      <div className="flex">
        <button className="p-2" onClick={signOut}>Sign Out</button>
        <div className="p-2">Profile</div>
      </div>
    </nav>
  );
};
