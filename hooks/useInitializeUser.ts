import { useEffect } from 'react';
import { useUser } from './useUser';
import useLogger from './useLogger';
import { getMyUser } from '../api/user';
import { User } from '../interfaces/user';

const useInitializeUser = (setUser: (user: User | null) => void) => {
  const logger = useLogger();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyUser();
        console.log('useInitializeUser data', data);

        setUser(data.user);
        localStorage.setItem('token', data.token);
      } catch (err) {
        logger.error(err);
      }
    })();
  }, []);
};

export default useInitializeUser;

// @Controller('/users')

// @Get('/my')
// const (@Req() req, res) => {
//   if (req.headers.Authorization) {
//     const [_, token] = req.headers.Authorization.split(' ');
//     // проверяем валидность токена
//     // если валидный, то достаем id юзера
//     // ищем пользователя в базе по id
//     // отправляем его на фронт
//     // иначе send 401
//   }
// }
