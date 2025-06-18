import { Outlet } from 'react-router';
import ItemFilter from '../../features/ItemFilter/ItemFilter';

function Listing() {
  return (
    <div>
      <div style={{ margin: '1rem' }}>
        <ItemFilter />
      </div>
      <Outlet />
    </div>
  );
}

export default Listing;
