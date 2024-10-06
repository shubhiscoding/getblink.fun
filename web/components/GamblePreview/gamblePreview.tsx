import './gamblepreview.css';
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
                <h5 className="text-xl font-bold">{label}</h5>
                <h4>Select Your bet</h4>
                <div className='bets'>
                  <label className='bet' onClick={handleClick}>More then 5 <input type='radio' name='bet' value='10' defaultChecked /></label>
                  <label className='bet' onClick={handleClick}>Less then 5 <input type='radio' name='bet' value='10' defaultChecked /></label>
                </div>
                <div className='payInputs'>
                    <div className="input-with-button">
                        <input type="text" className="input-box mt-2" placeholder="Enter the amount of SOL for Bet" />
                        <button className="btn btn-secondary mt-2 tnx" onClick={handleClick}>Place  Bet</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preview;
