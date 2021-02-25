import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';

applyPolyfills().then(() => {
  defineCustomElements();
});

const dsid = "1114"; // dataset ID for Throughput Annotation Widget

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, Throughput Annotation Widget in React!</h1>
        <throughput-widget identifier="r3d100011761" link={dsid} additional-type="site" read-only-mode="true"/>
      </header>
    </div>
  );
}

export default App;
