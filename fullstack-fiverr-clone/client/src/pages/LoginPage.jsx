import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    // giriş işlemini geçekleştir
    api
      .post('/auth/login', data)
      // başarılı olursa kulalnıcn bilgilerini lokale aktar
      .then((res) => {
        localStorage.setItem(
          'currentUser',
          JSON.stringify(res.data.user)
        );

        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col justify-center items-center p-5 sm:pt-24">
      <h2 className="font-bold text-3xl mb-10 ">
        Hesabınıza Giriş Yapın
      </h2>
      <form
        onSubmit={handleSubmit}
        class="max-w-[700px]  sm:min-w-[400px] max-sm:w-full"
      >
        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900 ">
            İsim
          </label>
          <input
            name="username"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
            placeholder="ör:ahmet"
          />
        </div>

        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900 ">
            Şifre
          </label>
          <input
            name="password"
            type="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
            placeholder="...."
          />
        </div>

        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            class="min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            Giriş Yap
          </button>
        </div>

        <p className="mt-4 text-gray-400">
          Hesabınız yok mu?{' '}
          <Link className="text-blue-400" to={'/register'}>
            Kaydol
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
