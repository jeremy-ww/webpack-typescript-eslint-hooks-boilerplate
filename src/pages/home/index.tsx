import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserAction } from './store/slice';
import { RootState } from 'src/store/';
import icon from 'src/assets/icon-square-big.png';
import { Hello } from './index.css';

export default function Home() {
  const dispatch = useDispatch();
  const home = useSelector((store: RootState) => store.home);

  useEffect(() => {
    dispatch(getUserAction());
  }, []);

  return (
    <Hello>
      {home.loading ? (
        <p>loading...</p>
      ) : (
        <>
          <img width="20" src={icon} alt="icon" /> Hello, {home.user}{' '}
          <small>- ({process.env.NODE_ENV})</small>
        </>
      )}
    </Hello>
  );
}
