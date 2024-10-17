import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import people from '../assets/people.png';

function Home() {
  return (
    <div className="text-gray-300"> 
    <div className=" flex flex-col space-x-9 lg:flex-row lg:justify-between lg:items-center  min-h-screen">
        
      <div className='flex flex-col lg:ml-40 '>
        <motion.div
          animate={{ y: -80 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <div className="font-semibold text-6xl mb-6">OPINIO,</div>
          <TypeAnimation
            className="text-gray-400 text-xl md:text-2xl"
            sequence={['A Place Where Your Opinion Matters!', 1000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>
      </div>
      {/* <div className="relative w-96 h-72 rounded-full lg:ml-10 p-2">
        <img
          className="w-60 h-full object-cover "
          src={people}
          alt="Glowing Image"
        />
      </div> */}
    </div>
    </div>
  );
}

export default Home;
