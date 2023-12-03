import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Header = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    api
      .post('/auth/logout')
      .then(() => {
        localStorage.removeItem('currentUser');
        navigate('/');
      })
      .catch((err) => console.log(err));
  };
  return (
    <header className="p-5">
      <div className="flex justify-between">
        <div>
          <Link>
            <img
              width={100}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fiverr_Logo_09.2020.svg/2560px-Fiverr_Logo_09.2020.svg.png"
            />
          </Link>
        </div>
        <nav className="flex gap-3 font-medium items-center">
          <span className="max-sm:hidden">İş Çözümleri</span>
          <span className="max-sm:hidden">Keşfet</span>
          <span className="max-sm:hidden">Satıcı Ol</span>

          {currentUser ? (
            <div className="group relative flex items-center gap-2">
              <img
                className=" h-[40px] w-[40px] rounded-full object-cover"
                src={currentUser.img}
              />
              <span>{currentUser.username}</span>

              <div className="text-[13px] hidden group-hover:flex flex-col absolute top-10 right-[-10px] bg-gray-200 rounded-md ">
                {currentUser.isSeller && (
                  <>
                    <Link className="px-5 py-2 hover:bg-gray-100">
                      Hizmetler
                    </Link>
                    <Link className="whitespace-nowrap px-5 py-2 hover:bg-gray-100">
                      Hizmet Ekle
                    </Link>
                  </>
                )}
                <Link className="px-5 py-2 hover:bg-gray-100">
                  Siparişler
                </Link>
                <Link className="px-5 py-2 hover:bg-gray-100">
                  Messages
                </Link>
                <Link
                  onClick={handleLogout}
                  className="px-5 py-2 hover:bg-gray-100"
                >
                  Çıkış Yap
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link to={'/login'} className="hover:text-green-500">
                Giriş Yap
              </Link>
              <Link
                to={'/register'}
                className="hover:bg-green-500 hover:text-white text-green-500 border border-green-400 p-1 rounded"
              >
                Kaydol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
