"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './onboarding.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@civic/auth/react';

const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.uploaderIcon}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>);
const CrossIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', gender: '',
    phone: '', email: '', panNumber: '', phoneOtp: '',
    service: '', experience: '', profilePicture: null as File | null,
    accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verification, setVerification] = useState({
    phoneOtpSent: false, phoneVerified: false, phoneLoading: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NEW: State to handle the submission animation ---
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    if (user) {
      const savedProfileJSON = localStorage.getItem(`workerProfile_${user.did}`);
      if (savedProfileJSON) {
        const savedProfile = JSON.parse(savedProfileJSON);
        setFormData({ ...savedProfile, profilePicture: null });
      }
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, profilePicture: file }));
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePicture: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendOtp = () => {
    setVerification(prev => ({ ...prev, phoneOtpSent: true }));
  };
  
  const handleVerifyOtp = () => {
    if (verification.phoneLoading) return;
    setVerification(prev => ({ ...prev, phoneLoading: true }));
    setTimeout(() => {
      if (formData.phoneOtp.length === 6 && /^\d{6}$/.test(formData.phoneOtp)) {
        setVerification(prev => ({ ...prev, phoneVerified: true, phoneLoading: false }));
      } else {
        setVerification(prev => ({ ...prev, phoneLoading: false }));
        alert("Invalid OTP format. Please enter 6 digits.");
      }
    }, 1500);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  // --- UPDATED: handleSubmit function with animation logic ---
  const handleSubmit = (e: FormEvent) => { 
    e.preventDefault(); 
    if (!user) {
      alert("You must be logged in to submit a profile.");
      return;
    }
    
    // 1. Start loading animation
    setSubmissionStatus('loading');

    // 2. Simulate saving data and show success
    setTimeout(() => {
      localStorage.setItem(`workerProfile_${user.did}`, JSON.stringify(formData));
      setSubmissionStatus('success');

      // 3. Redirect after showing success animation
      setTimeout(() => {
        router.push('/worker/dashboard');
      }, 1500); // Wait 1.5s to show the tick

    }, 2000); // Wait 2s for loading
  };

  const RequiredStar = () => <span className={styles.requiredStar}>*</span>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <header className={styles.header}><h1>Join Our Professional Network</h1><p>Complete your profile to start accepting jobs.</p></header>
        <div className={styles.stepper}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}><div className={styles.stepNumber}>1</div><div className={styles.stepLabel}>Worker Details</div></div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}><div className={styles.stepNumber}>2</div><div className={styles.stepLabel}>Bank Details</div></div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}><div className={styles.stepNumber}>3</div><div className={styles.stepLabel}>Profile Photo</div></div>
        </div>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <>
              <fieldset className={styles.fieldset}><legend className={styles.legend}>Personal & Professional</legend>
                <div className={styles.gridThreeCol}><div className={styles.formGroup}><label htmlFor="firstName">First Name <RequiredStar/></label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required/></div><div className={styles.formGroup}><label htmlFor="middleName">Middle Name</label><input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange}/></div><div className={styles.formGroup}><label htmlFor="lastName">Last Name <RequiredStar/></label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required/></div></div>
                <div className={styles.gridTwoCol}><div className={styles.formGroup}><label htmlFor="dob">Date of Birth <RequiredStar/></label><input type="date" id="dob" name="dob" value={formData.dob} onChange={handleInputChange} required/></div><div className={styles.formGroup}><label htmlFor="gender">Gender <RequiredStar/></label><select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required><option value="" disabled>Select...</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div></div>
                <div className={styles.gridTwoCol}><div className={styles.formGroup}><label htmlFor="service">Service <RequiredStar/></label><select id="service" name="service" value={formData.service} onChange={handleInputChange} required><option value="" disabled>Select...</option><option value="plumber">Plumber</option><option value="electrician">Electrician</option><option value="carpenter">Carpenter</option></select></div><div className={styles.formGroup}><label htmlFor="experience">Experience (Years) <RequiredStar/></label><input type="number" id="experience" name="experience" min="0" max="50" value={formData.experience} onChange={handleInputChange} required/></div></div>
              </fieldset>
              <fieldset className={styles.fieldset}><legend className={styles.legend}>Contact & Identity</legend>
                <div className={styles.formGroup}><label htmlFor="email">Email <RequiredStar/></label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required/></div>
                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number <RequiredStar/></label>
                    <div className={styles.inputWithButton}>
                        <div className={styles.phoneInputWrapper}>
                            <span className={styles.countryCode}>+91</span>
                            <input type="tel" id="phone" name="phone" pattern="\d{10}" title="Enter a 10-digit mobile number" value={formData.phone} onChange={handleInputChange} required disabled={verification.phoneVerified}/>
                        </div>
                        {!verification.phoneVerified && <button type="button" onClick={handleSendOtp} disabled={verification.phoneLoading}>{verification.phoneOtpSent?'Resend OTP':'Send OTP'}</button>}
                        {verification.phoneVerified && <span className={styles.verifiedText}>✓ Verified</span>}
                    </div>
                    {verification.phoneOtpSent && !verification.phoneVerified && (<div className={styles.otpSection}><input type="text" name="phoneOtp" placeholder="Enter 6-digit OTP" maxLength={6} value={formData.phoneOtp} onChange={handleInputChange}/><button type="button" className={styles.verifyButton} onClick={handleVerifyOtp} disabled={verification.phoneLoading}>{verification.phoneLoading ? <div className={styles.spinner}></div> : 'Verify'}</button></div>)}
                </div>
                <div className={styles.formGroup}><label htmlFor="panNumber">PAN Card <RequiredStar/></label><input type="text" id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleInputChange} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required/></div>
              </fieldset>
            </>
          )}

          {currentStep === 2 && (
            <fieldset className={styles.fieldset}><legend className={styles.legend}>Bank Account Details</legend>
                <p className={styles.fieldDescription}>Ensure these details are accurate to receive payments.</p>
                <div className={styles.formGroup}><label htmlFor="accountHolderName">Account Holder Name <RequiredStar/></label><input type="text" id="accountHolderName" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label htmlFor="accountNumber">Account Number <RequiredStar/></label><input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} pattern="\d{9,18}" title="Enter a valid account number" required /></div>
                <div className={styles.gridTwoCol}>
                    <div className={styles.formGroup}><label htmlFor="ifscCode">IFSC Code <RequiredStar/></label><input type="text" id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label htmlFor="bankName">Bank Name <RequiredStar/></label><input type="text" id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} required /></div>
                </div>
            </fieldset>
          )}

          {currentStep === 3 && (
             <fieldset className={styles.fieldset}><legend className={styles.legend}>Profile Picture</legend>
              <div className={`${styles.formGroup} ${styles.uploaderGroup}`}><label className={styles.mainUploaderLabel}>Profile Picture <RequiredStar/></label><div className={styles.profilePicContainer}><label htmlFor="profilePicture" className={styles.profilePicUploader}>{imagePreview ? <Image src={imagePreview} alt="Preview" layout="fill" objectFit="cover"/> : <div className={styles.uploadPlaceholder}><CameraIcon/><span>Upload Photo</span></div>}</label>{imagePreview && <button type="button" onClick={handleRemoveImage} className={styles.removePicButton}><CrossIcon/></button>}<input type="file" id="profilePicture" className={styles.fileInputHidden} onChange={handleFileChange} accept="image/png, image/jpeg" required ref={fileInputRef}/></div><p className={styles.uploaderHelpText}>Supports: JPG, PNG | Max Size: 5MB</p></div>
            </fieldset>
          )}
          
          <div className={styles.formNavigation}>
              {currentStep > 1 && (<button type="button" className={styles.backButton} onClick={prevStep}>Back</button>)}
              {currentStep < 3 && (<button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>)}
              {currentStep === 3 && (<button type="submit" className={styles.submitButton}>Submit Profile</button>)}
          </div>
        </form>
      </div>

      {/* --- NEW: Submission Overlay JSX --- */}
      {submissionStatus !== 'idle' && (
        <div className={styles.submissionOverlay}>
          <div className={styles.submissionContent}>
            {submissionStatus === 'loading' && (
              <>
                <div className={styles.spinner}></div>
                <p>Submitting your profile...</p>
              </>
            )}
            {submissionStatus === 'success' && (
              <div className={styles.successAnimation}>
                <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                  <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <p>Profile Created Successfully!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}