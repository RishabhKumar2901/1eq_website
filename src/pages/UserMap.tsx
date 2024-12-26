import { useState } from 'react';
import Navbar from '../components/Navbar';
import Chatbot from './Chatbot';
import Heatmap from './HeatMap';
import PointerMap from './PointerMap';
import { getUserCountByPincode } from '../static/Functions';

const UserMap = () => {
  const [viewMode, setViewMode] = useState('heatmap');

  const handleToggleView = (mode: string) => {
    setViewMode(mode === 'heatmap' ? 'heatmap' : 'pointermap');
  };

  return (
    <>
      <Navbar onRefreshClick={() => getUserCountByPincode()} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-4/5 lg:w-3/4 mx-auto">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            User Distribution in India
          </h1>

          <div className="flex justify-center mb-6">
            <button
              className={`mr-4 px-4 py-2 rounded ${viewMode === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleToggleView('heatmap')}
            >
              Heatmap
            </button>
            <button
              className={`px-4 py-2 rounded ${viewMode === 'pointermap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleToggleView('pointermap')}
            >
              Pointer Map
            </button>
          </div>

          {viewMode === 'heatmap' ? (
            <Heatmap  />
          ) : (
            <PointerMap />
          )}
        </div>
      </div>

      <Chatbot />
    </>
  );
};

export default UserMap;
