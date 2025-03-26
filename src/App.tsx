import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './App.css';
import { fetchUsers } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ItemsInterface {
  id: string;
  namaBarang: string;
  harga: number;
  count?: number;
  createdAt: Date
}

const App: React.FC = () => {

  const [items, setItems] = useState<ItemsInterface[]>([])
  const [counts, setCounts] = useState<{[key: string]: number}>(
    items.reduce((acc: any, item: any) => ({
      ...acc, [item.id]: 1
    }), {})
  );

 // Pakai useQuery
 const { data: itemsData = [], isLoading, error } = useQuery({
    // Unique key untuk cache
    queryKey: ['items'], 
    // Fungsi untuk fetch data
    queryFn: fetchUsers, 
    // 1 jam
    staleTime: 1000 * 60 * 60, 
  });

  useEffect(() => {
    if (itemsData.length > 0) {
      setItems(itemsData);
      const initialCounts = itemsData.reduce((acc: any, item: any) => {
        acc[item.id] = 1;
        return acc;
      }, {});
      setCounts(initialCounts);
    }
  }, [itemsData])

  // Menampilkan toast.error saat ada error dari useQuery
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${(error as Error).message}`, {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  }, [error]);

  // Handle loading dan error
  if (isLoading) return (
    <div className='container-loading'>
      <p>Loading...</p>
    </div>
  );
  
  if (error) return (
    <div className='container-error'>
      <p>Error: {(error as Error).message}</p>
    </div>
  );

  const addCount = (id: string) => {
   setCounts((prevCount: any) => ({
    ...prevCount,
    [id]: prevCount[id] + 1,
   }));
  }

  const minCount = (id: string) => {
    setCounts((prevCount: any) => ({
      ...prevCount,
      [id]: prevCount[id] > 0 ? prevCount[id] - 1 : 0,
     }));
  }

  const handleSave = () => {
    items.map((item: any) => ({
      ...item,
      count: counts[item.id],
      totalPrice: item.harga * counts[item.id]
    }))
    toast.success('Success to save data!');
  }

  return (
    <>
      <div className="container">

        <h1>Test Case - React + React-query</h1>

        <table border={1} style={{borderRadius: '4px'}}>
          <thead>
            <tr>
              <th>Nama barang</th>
              <th>Harga</th>
              <th>Opsi</th>
            </tr>
          </thead>
          <tbody>
           {
            items.map((item: any) => (
              <tr key={item.id}>
                <td>{item.namaBarang}</td>
                <td>{item.harga * counts[item.id]}</td>
                <td style={{padding: '10px', display: 'flex', alignItems: 'center'}}>
                  <button style={{border: '1px solid black', borderRadius: '10px', margin: '4px'}} onClick={() => minCount(item.id)}>
                    -
                  </button>
                  <p style={{margin: '0 20px'}}>
                    {counts[item.id]}
                  </p>
                  <button style={{border: '1px solid black', borderRadius: '10px', margin: '4px'}} onClick={() => addCount(item.id)}>
                    +
                  </button>
                </td>
              </tr>
            ))
           }
          </tbody>          
        </table>
        <button className='btn-save' onClick={handleSave}>
            Save data
        </button>

        <ToastContainer position='top-center' autoClose={2000} />
      </div>
    </>
  )
}

export default App
