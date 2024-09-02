import './preview.css';
interface FormProps {
    icon: string;
    label: string;
    description: string;
    title: string;
  }

const Preview: React.FC<FormProps> = ({ icon, label, description, title }) => {
    return (
        <div className="Preview">
            <h1 className='gradient-text'>Preview</h1>
            <div className='preview-card'>
                <div className='image'>
                    <img src={icon} alt="Icon" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-2">{description}</p>
                <h5 className="text-xl font-bold">{label}</h5>
                <div className='payInputs'>
                    <button className="btn btn-primary mt-4 tnx">Send 0.03 SOL</button>
                    <div className="input-with-button">
                        <input type="text" className="input-box mt-2" placeholder="Enter the amount of SOL to send*" />
                        <button className="btn btn-secondary mt-2 tnx">Send SOL</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preview;
