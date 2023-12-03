import { useState } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  // 1) buluta resmi yükle
  const upload = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'fiverr');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dlpvepgfc/image/upload',
        data
      );

      return res.data.url;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // formdaki verilere erişme
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    // resmi bulut depolama alanına yükleme
    const imgUrl = await upload(data.img);

    // buluttaki resmin url'ini ap'a gönderieceğimi veriye ekleme
    data.img = imgUrl;

    // satıcı hesabımı belirtme
    data.isSeller = isChecked;

    // kullanıcı hesabı oluşturmak için istek atıcaz
    api
      .post('/auth/register', data)
      .then((res) => {
        // logine yönlendir
        navigate('/login');
        // bildirim gönder
        toast.success('Hesabınız oluşturuldu. Lütfen giriş yapın.');
      })
      .catch((err) => {
        toast.error('Hesap oluşturulurken bir hata oluştu');
      });
  };

  return (
    <div className="h-[calc(100vh-100px)] p-5 sm:pt-24">
      <form
        onSubmit={handleSubmit}
        class="max-w-[700px] mx-auto grid grid-cols-2 sm:gap-[90px] gap-10"
      >
        {/* normal kullanıcı alanı */}
        <div className="max-sm:col-span-2">
          <h1 className="text-xl font-bold mb-4 text-center">
            Yeni Hesap Oluştur
          </h1>
          <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 ">
              İsim
            </label>
            <input
              name="username"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="name"
              required
            />
          </div>
          <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 ">
              Mail
            </label>
            <input
              name="email"
              type="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="name@flowbite.com"
              required
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
            />
          </div>
          <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 ">
              Profil Fotoğrafı
            </label>
            <input
              name="img"
              type="file"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              placeholder="......"
            />
          </div>
          <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 ">
              Ülke
            </label>
            <input
              name="country"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              placeholder="Turkey"
            />
          </div>
        </div>
        {/* satıcı alanı */}
        <div className="max-sm:col-span-2">
          <h1 className="text-xl font-bold mb-4 text-center">
            Satıcı olmak isityorum
          </h1>
          <div className="flex justify-center">
            <label class="toggle-switch">
              <input
                onChange={() => {
                  setIsChecked(!isChecked);
                }}
                type="checkbox"
              />
              <div class="toggle-switch-background">
                <div class="toggle-switch-handle"></div>
              </div>
            </label>
          </div>
          <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 ">
              Telefon
            </label>
            <input
              disabled={!isChecked}
              type="tel"
              name="number"
              class="disabled:bg-gray-200 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="+9053565234"
              required
            />
          </div>
          <div class="mb-5">
            <label class=" block mb-2 text-sm font-medium text-gray-900 ">
              Açıklama
            </label>
            <textarea
              disabled={!isChecked}
              type="text"
              name="desc"
              class="disabled:bg-gray-200 min-h-[100px] max-h-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
        </div>

        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            class="min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            Kaydol
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
