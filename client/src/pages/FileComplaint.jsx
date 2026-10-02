import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './FileComplaint.css';

const FileComplaint = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data);
      } catch (err) {
        console.error('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      setError('You can only upload up to 3 files');
      e.target.value = '';
      return;
    }
    setFiles(e.target.files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept || !formData.category) {
      setError('Please select a department and category');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('department', selectedDept);
      data.append('priority', formData.priority);
      
      for (let i = 0; i < files.length; i++) {
        data.append('attachments', files[i]);
      }

      await api.post('/complaints', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file complaint');
      setLoading(false);
    }
  };

  const activeDeptObj = departments.find(d => d._id === selectedDept);

  return (
    <div className="file-complaint-container">
      <div className="form-card">
        <h2>File a New Complaint</h2>
        <p>Please provide detailed information to help us resolve the issue faster.</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label>Complaint Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title}
              onChange={handleInputChange}
              required 
              placeholder="E.g., Broken street light on Main St."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={!selectedDept}
              >
                <option value="">-- Select Category --</option>
                {activeDeptObj?.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="5"
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Attachments (Max 3 files, images/PDF)</label>
              <input 
                type="file" 
                multiple 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileComplaint;
