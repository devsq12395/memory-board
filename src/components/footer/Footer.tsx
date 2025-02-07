import React from 'react';

const Footer = () => {
  return (
    <footer className="absolute top-[88vh] h-[12vh] w-full min-w-[1200px] bg-blue-100">
      <div className="absolute left-[75px] bottom-[50px]">
        <img src="/path/to/avatar.png" alt="Avatar" className="w-[200px] h-[200px] rounded-full" />
      </div>
      <h1 className="mx-[300px] my-[25px] text-3xl font-bold">SomeName's Memory Board</h1>
    </footer>
  );
};

export default Footer;