import LandTokenForm from '../components/LandTokenForm';

export default function CreateLandTokenPage() {
  const handleSubmit = (data: any) => {
    // Mock: just log the data
    console.log('Land token data:', data);
  };

  return (
    <div className="min-h-screen bg-evergreen-50 flex flex-col items-center justify-center py-8">
      <LandTokenForm onSubmit={handleSubmit} />
    </div>
  );
} 