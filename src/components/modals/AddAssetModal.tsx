'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { fmt } from '@/lib/utils';

export default function AddAssetModal() {
  const { addAssetModal, closeAddAsset, addSelfAsset, showToast } = useApp();
  const [type, setType] = useState<'fd' | 'real_estate' | 'unlisted_shares' | 'other'>('fd');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [institution, setInstitution] = useState('');
  const [maturityDate, setMaturityDate] = useState('');

  if (!addAssetModal) return null;

  function saveAsset() {
    const v = parseFloat(value);
    if (!name.trim() || !v || v <= 0) {
      showToast('⚠️', 'Missing Info', 'Please enter asset name and value.');
      return;
    }
    addSelfAsset({ type, name: name.trim(), value: v, institution: institution || undefined, maturityDate: maturityDate || undefined });
    showToast('✅', 'Asset Added', `${name.trim()} (₹${fmt(v)}) added to your portfolio.`);
    setName(''); setValue(''); setInstitution(''); setMaturityDate('');
    closeAddAsset();
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && closeAddAsset()}>
      <div className="modal add-asset-modal">
        <div className="modal-hdr">
          <div className="modal-title">Add Self-Declared Asset</div>
          <button className="modal-x" onClick={closeAddAsset}>×</button>
        </div>
        <div className="fg">
          <label>Asset Type</label>
          <select className="aa-select" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="fd">Fixed Deposit</option>
            <option value="real_estate">Real Estate</option>
            <option value="unlisted_shares">Unlisted Shares</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="fg">
          <label>Asset Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SBI FD, Farmhouse Lonavala" />
        </div>
        <div className="fg">
          <label>Value (₹)</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 5000000" />
        </div>
        <div className="fg">
          <label>Institution (optional)</label>
          <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. SBI, HDFC" />
        </div>
        <div className="fg">
          <label>Maturity Date (optional)</label>
          <input type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={saveAsset}>Add Asset</button>
      </div>
    </div>
  );
}
