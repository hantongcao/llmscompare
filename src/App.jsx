import React from 'react';
import ModelComparison from './components/ModelComparison';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 多模型输出对比</h1>
        <p>同时对比多个AI模型的回答输出，直观比较不同模型的性能表现</p>
      </header>
      
      <main className="app-main">
        <ModelComparison />
      </main>
      
      <footer className="app-footer">
        <p>Powered by Silicon Flow API</p>
      </footer>
    </div>
  );
}