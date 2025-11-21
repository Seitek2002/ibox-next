import { FC } from 'react';

import SubHeader from './SubHeader';
import SupHeader from './SupHeader';

interface IProps {
  searchText: string;
  setSearchText?: (text: string) => void;
}

const Header: FC<IProps> = ({ searchText, setSearchText }) => {
  return (
    <header className='bg-white rounded-[12px] p-[12px]'>
      <SupHeader searchText={searchText} setSearchText={setSearchText} />
      <hr className='my-[10px] border-[#e5e7eb]' />
      <SubHeader />
    </header>
  );
};

export default Header;
