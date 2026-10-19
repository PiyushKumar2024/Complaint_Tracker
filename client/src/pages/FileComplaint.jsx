import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const FileComplaint = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    address: '',
    city: '',
    pincode: ''
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load departments. Please refresh and try again.');
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const filePreviews = files.map((file) => ({
      file,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setPreviews(filePreviews);

    return () => {
      filePreviews.forEach((preview) => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
    };
  }, [files]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 3) {
      setError('You can only upload up to 3 files');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedExtensions = /\.(jpe?g|png|gif|pdf|docx?)$/i;
    const invalidFile = selectedFiles.find((file) => (
      file.size > 5 * 1024 * 1024 || !allowedExtensions.test(file.name)
    ));
    if (invalidFile) {
      setError(invalidFile.size > 5 * 1024 * 1024
        ? `${invalidFile.name} exceeds the 5 MB file size limit.`
        : `${invalidFile.name} is not an accepted file type.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFiles([]);
      return;
    }

    setFiles(selectedFiles);
    setError('');
  };

  const removeFile = (fileToRemove) => {
    setFiles((currentFiles) => {
      const remaining = currentFiles.filter((file) => file !== fileToRemove);
      if (fileInputRef.current && remaining.length === 0) fileInputRef.current.value = '';
      return remaining;
    });
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
      data.append('location', JSON.stringify({
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      }));
      
      files.forEach((file) => data.append('attachments', file));

      await api.post('/complaints', data);

      showToast('Your complaint has been submitted.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file complaint');
      setLoading(false);
    }
  };

  const activeDeptObj = departments.find(d => d._id === selectedDept);

  return (
    <div className="mx-auto max-w-3xl p-4 py-8 sm:p-8">
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-ink-900">File a New Complaint</h2>
        <p className="mt-1 text-muted-500">Please provide detailed information to help us resolve the issue faster.</p>
        
        {error && <div className="my-5 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="complaint-title">Complaint Title</label>
            <input 
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="complaint-title"
              type="text" 
              name="title" 
              value={formData.title}
              onChange={handleInputChange}
              minLength={5}
              maxLength={100}
              required 
              placeholder="E.g., Broken street light on Main St."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink-700" htmlFor="complaint-department">Department</label>
              <select 
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-slate-50"
                id="complaint-department"
                value={selectedDept} 
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setFormData((current) => ({ ...current, category: '' }));
                }}
                disabled={loadingDepartments || departments.length === 0}
                required
              >
                <option value="">
                  {loadingDepartments ? 'Loading departments...' : '-- Select Department --'}
                </option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink-700" htmlFor="complaint-category">Category</label>
              <select 
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-slate-50"
                id="complaint-category"
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

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="complaint-description">Description</label>
            <textarea 
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="complaint-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              minLength={20}
              maxLength={2000}
              rows="5"
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700">Location (optional)</label>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="min-h-11 min-w-0 rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                maxLength={200}
                placeholder="Street address"
                aria-label="Street address"
              />
              <input
                className="min-h-11 min-w-0 rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                maxLength={100}
                placeholder="City"
                aria-label="City"
              />
              <input
                className="min-h-11 min-w-0 rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="6-digit PIN code"
                aria-label="6-digit PIN code"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink-700" htmlFor="complaint-priority">Priority</label>
              <select className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" id="complaint-priority" name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink-700" htmlFor="complaint-attachments">Attachments (up to 3 files, 5 MB each)</label>
              <input 
                className="block w-full rounded-lg border border-slate-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:font-semibold file:text-brand-700"
                id="complaint-attachments"
                ref={fileInputRef}
                type="file" 
                multiple 
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <small className="block text-xs text-muted-500">Images, PDF, DOC, or DOCX. Maximum 5 MB per file.</small>
              {previews.length > 0 && (
                <ul className="mt-3 space-y-2" aria-label="Selected attachments">
                  {previews.map(({ file, url }) => (
                    <li className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 p-2.5" key={`${file.name}-${file.lastModified}`}>
                      {url
                        ? <img className="h-12 w-12 rounded object-cover" src={url} alt={`Preview of ${file.name}`} />
                        : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-500" aria-hidden="true">FILE</span>}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <strong className="truncate text-sm text-ink-700" title={file.name}>{file.name}</strong>
                        <small className="text-xs text-muted-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</small>
                      </span>
                      <button className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" type="button" onClick={() => removeFile(file)} aria-label={`Remove ${file.name}`}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 max-[420px]:flex-col-reverse">
            <button type="button" onClick={() => navigate('/dashboard')} className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-ink-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={loading || loadingDepartments || departments.length === 0} className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileComplaint;
