"use client";

import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import styles from './onboarding.module.css';
import Image from 'next/image';

const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.uploaderIcon}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>);
const CrossIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export default function WorkerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', gender: '',
    phone: '', email: '', panNumber: '', phoneOtp: '', emailOtp: '',
    service: '', experience: '', profilePicture: null as File | null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verification, setVerification] = useState({
    phoneOtpSent: false, emailOtpSent: false,
    phoneVerified: false, emailVerified: false,
    phoneLoading: false, emailLoading: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  
  const handleSendOtp = (type: 'phone' | 'email') => {
    if (type === 'phone') setVerification(prev => ({ ...prev, phoneOtpSent: true }));
    else setVerification(prev => ({ ...prev, emailOtpSent: true }));
  };
  
  const handleVerifyOtp = (type: 'phone' | 'email') => {
    const otp = (type === 'phone' ? formData.phoneOtp : formData.emailOtp);
    const isLoading = (type === 'phone' ? verification.phoneLoading : verification.emailLoading);
    if (isLoading) return;

    if (type === 'phone') setVerification(prev => ({ ...prev, phoneLoading: true }));
    else setVerification(prev => ({ ...prev, emailLoading: true }));

    // Simulate network delay
    setTimeout(() => {
      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        if (type === 'phone') setVerification(prev => ({ ...prev, phoneVerified: true, phoneLoading: false }));
        else setVerification(prev => ({ ...prev, emailVerified: true, emailLoading: false }));
      } else {
        if (type === 'phone') setVerification(prev => ({ ...prev, phoneLoading: false }));
        else setVerification(prev => ({ ...prev, emailLoading: false }));
        alert("Invalid OTP format. Please enter 6 digits."); // Can be replaced with inline error message
      }
    }, 1500);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); alert("Profile submitted successfully!"); };

  const RequiredStar = () => <span className={styles.requiredStar}>*</span>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <header className={styles.header}><h1>Join Our Professional Network</h1><p>Complete your profile to start accepting jobs.</p></header>
        <div className={styles.stepper}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}><div className={styles.stepNumber}>1</div><div className={styles.stepLabel}>Personal</div></div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}><div className={styles.stepNumber}>2</div><div className={styles.stepLabel}>Contact</div></div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}><div className={styles.stepNumber}>3</div><div className={styles.stepLabel}>Profile</div></div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <fieldset className={styles.fieldset}><legend className={styles.legend}>Personal Details</legend>
              <div className={styles.gridThreeCol}><div className={styles.formGroup}><label htmlFor="firstName">First Name <RequiredStar/></label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required/></div><div className={styles.formGroup}><label htmlFor="middleName">Middle Name</label><input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange}/></div><div className={styles.formGroup}><label htmlFor="lastName">Last Name <RequiredStar/></label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required/></div></div>
              <div className={styles.gridTwoCol}><div className={styles.formGroup}><label htmlFor="dob">Date of Birth <RequiredStar/></label><input type="date" id="dob" name="dob" value={formData.dob} onChange={handleInputChange} required/></div><div className={styles.formGroup}><label htmlFor="gender">Gender <RequiredStar/></label><select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required><option value="" disabled>Select...</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div></div>
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className={styles.fieldset}><legend className={styles.legend}>Contact & Identity Verification</legend>
              <div className={styles.formGroup}><label htmlFor="email">Email <RequiredStar/></label><div className={styles.inputWithButton}><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={verification.emailVerified}/>{!verification.emailVerified && <button type="button" onClick={() => handleSendOtp('email')} disabled={verification.emailLoading}>{verification.emailOtpSent?'Resend':'Send OTP'}</button>}{verification.emailVerified && <span className={styles.verifiedText}>✓ Verified</span>}</div>{verification.emailOtpSent && !verification.emailVerified && (<div className={styles.otpSection}><input type="text" name="emailOtp" placeholder="Enter 6-digit OTP" maxLength={6} value={formData.emailOtp} onChange={handleInputChange}/><button type="button" className={styles.verifyButton} onClick={() => handleVerifyOtp('email')} disabled={verification.emailLoading}>{verification.emailLoading ? <div className={styles.spinner}></div> : 'Verify'}</button></div>)}</div>
              <div className={styles.formGroup}><label htmlFor="phone">Phone <RequiredStar/></label><div className={styles.inputWithButton}><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required disabled={verification.phoneVerified}/>{!verification.phoneVerified && <button type="button" onClick={() => handleSendOtp('phone')} disabled={verification.phoneLoading}>{verification.phoneOtpSent?'Resend':'Send OTP'}</button>}{verification.phoneVerified && <span className={styles.verifiedText}>✓ Verified</span>}</div>{verification.phoneOtpSent && !verification.phoneVerified && (<div className={styles.otpSection}><input type="text" name="phoneOtp" placeholder="Enter 6-digit OTP" maxLength={6} value={formData.phoneOtp} onChange={handleInputChange}/><button type="button" className={styles.verifyButton} onClick={() => handleVerifyOtp('phone')} disabled={verification.phoneLoading}>{verification.phoneLoading ? <div className={styles.spinner}></div> : 'Verify'}</button></div>)}</div>
              <div className={styles.formGroup}><label htmlFor="panNumber">PAN Card <RequiredStar/></label><input type="text" id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleInputChange} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required/></div>
            </fieldset>
          )}

          {currentStep === 3 && (
            <fieldset className={styles.fieldset}><legend className={styles.legend}>Professional Profile</legend>
              <div className={styles.gridTwoCol}><div className={styles.formGroup}><label htmlFor="service">Service <RequiredStar/></label><select id="service" name="service" value={formData.service} onChange={handleInputChange} required><option value="" disabled>Select...</option><option value="plumber">Plumber</option><option value="electrician">Electrician</option><option value="carpenter">Carpenter</option></select></div><div className={styles.formGroup}><label htmlFor="experience">Experience (Years) <RequiredStar/></label><input type="number" id="experience" name="experience" min="0" max="50" value={formData.experience} onChange={handleInputChange} required/></div></div>
              <div className={`${styles.formGroup} ${styles.uploaderGroup}`}><label style={{textAlign:'center', width:'100%'}}>Profile Picture <RequiredStar/></label><div className={styles.profilePicContainer}><label htmlFor="profilePicture" className={styles.profilePicUploader}>{imagePreview ? <Image src={imagePreview} alt="Preview" layout="fill" objectFit="cover"/> : <div className={styles.uploadPlaceholder}><CameraIcon/><span>Upload Photo</span></div>}</label>{imagePreview && <button type="button" onClick={handleRemoveImage} className={styles.removePicButton}><CrossIcon/></button>}<input type="file" id="profilePicture" className={styles.fileInputHidden} onChange={handleFileChange} accept="image/png, image/jpeg" required ref={fileInputRef}/></div><p className={styles.uploaderHelpText}>Supports: JPG, PNG | Max Size: 5MB</p></div>
            </fieldset>
          )}
          
          <div className={styles.formNavigation}>{currentStep > 1 && (<button type="button" className={styles.backButton} onClick={prevStep}>Back</button>)}{currentStep < 3 && (<button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>)}{currentStep === 3 && (<button type="submit" className={styles.submitButton}>Submit Profile</button>)}</div>
        </form>
      </div>
    </div>
  );
}