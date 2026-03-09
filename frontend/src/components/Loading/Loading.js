import React from 'react';
import { useLoading } from '../../hooks/useLoading';
import classes from './loading.module.css';
import loadingImage from './loading.svg';

export default function Loading() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;  // important!
  console.log("isLoading:",isLoading);
  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <img src={loadingImage} alt="Loading!" width={100} height={100} />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
