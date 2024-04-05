"use client";
// components/DonateComponent.tsx

import React, { useState } from 'react';

const DonateComponent: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState('1$');

 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    console.log(`Donation amount: ${donationAmount}`);
    alert(`Thank you for your donation of $${donationAmount}!`);
    setDonationAmount('');
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Support Our Cause</h2>
      <p className="text-gray-600 mb-4">
        Your donation helps us continue our mission and make a difference. Every little bit counts and brings us closer to our goals.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700">Donation Amount</label>
          <div className="mt-1">
            <input
              type="number"
              id="donationAmount"
              name="donationAmount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full p-2 border-gray-300 rounded-md shadow-sm"
              placeholder="$0.00"
              min="1" 
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Donate Now
        </button>
      </form>
    </div>
  );
};

export default DonateComponent;
