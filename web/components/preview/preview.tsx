import './preview.css';
interface FormProps {
    icon: string;
    label: string;
    description: string;
    title: string;
  }

const Preview: React.FC<FormProps> = ({ icon, label, description, title }) => {
    const handleClick = () => {
      window.alert("It's a dummy button only for preview, Generate Blink and try it for real!!");
        return;
    }
    return (
        <div className="Preview">
            <div className='preview-card'>
                <div className='image'>
                    <img src={icon} alt="Icon" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-2">{description}</p>
                {label.length > 0 && <h5 className="text-xl font-bold">{label}</h5>}
                <div className='payInputs'>
                  <div className='senSolsbtns'>
                    <button className="btn btn-primary" onClick={handleClick}>0.01 SOL</button>
                    <button className="btn btn-primary sec" onClick={handleClick}>0.05 SOL</button>
                    <button className="btn btn-primary" onClick={handleClick}>1.00 SOL</button>
                  </div>
                    <div className="input-with-button">
                        <input type="text" className="input-box mt-2" placeholder="Enter the amount of SOL to send*" />
                        <button className="btn btn-secondary mt-2 tnx" onClick={handleClick}>Send SOL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preview;
