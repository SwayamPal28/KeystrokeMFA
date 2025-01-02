import React, { useState, useEffect } from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';

export function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuthStore();

  useEffect(() => {
    loadFiles();
  }, [currentUser]);

  const loadFiles = async () => {
    if (!currentUser?.id) {
      console.error('No user logged in or invalid user ID.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setFiles(data || []);
      console.log('Files loaded:', data);
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser?.id) {
      alert('Please log in to upload a file.');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) {
      console.error('No file selected.');
      alert('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      console.log('Uploading file:', file.name);

      const fileContent = await file.text();

      const { error } = await supabase.from('files').insert({
        name: file.name,
        content: fileContent,
        user_id: currentUser.id,
        size: file.size,
        type: file.type || 'text/plain',
      });

      if (error) {
        console.error('Error uploading file:', error.message);
        alert(`Error uploading file: ${error.message}`);
        return;
      }

      setMessage('File uploaded successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      console.log('File uploaded successfully.');
      loadFiles();
    } catch (err) {
      console.error('Unexpected error during file upload:', err);
      alert('An unexpected error occurred while uploading the file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file: any) => {
    try {
      console.log('Downloading file:', file.name);
      const blob = new Blob([file.content], { type: file.type });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Error downloading file.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Error deleting file:', error.message);
        alert(`Error deleting file: ${error.message}`);
        return;
      }

      setMessage('File deleted successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      console.log('File deleted successfully.');
      loadFiles();
    } catch (err) {
      console.error('Unexpected error during file deletion:', err);
      alert('An unexpected error occurred while deleting the file.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Upload className="w-6 h-6 mr-2 text-gray-500" />
          <span className="text-gray-500">
            {uploading ? 'Uploading...' : 'Click to upload file'}
          </span>
        </label>
      </div>

      {message && (
        <div className="mb-4 text-green-500 font-medium">{message}</div>
      )}

      <h3 className="text-lg font-semibold mb-4">
        {files.length > 0
          ? `Uploaded Files (${files.length})`
          : 'No files uploaded yet.'}
      </h3>

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB | Uploaded on: {new Date(file.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(file)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
