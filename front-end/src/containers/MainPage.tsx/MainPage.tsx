import { DataTable } from '../../components/DataTable/DataTable';
import { NavBar } from '../../components/NavigationBar/NavigationBar';

export const Main = () => {
  return (
    <>
      <NavBar />
      <div style={{ margin: '60px', height: 'auto' }}>
        <DataTable />
      </div>
    </>
  );
};
