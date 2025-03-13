import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CvService } from '../../core/services/cv.service';

@Component({
  selector: 'app-cv-form',
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.css'
})
export class CvFormComponent implements OnInit {
  cvForm!: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  cvId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cvService: CvService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      professionalSummary: ['', Validators.required],
      skills: [''],
      workExperience: this.fb.array([]),
      education: this.fb.array([]),
      dateAdded: [new Date()],
    });

    // Check if there's an ID in the URL (edit mode)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cvId = Number(id);
        this.loadCvData(this.cvId);
      }
    });
  }

  // Load existing CV data for editing
  loadCvData(id: number): void {
    this.cvService.getCvById(id).subscribe({
      next: (cv) => {
        this.cvForm.patchValue(cv);
      },
      error: (err) => console.error('Error fetching CV:', err)
    });
  }

  // Submit form (update or create)
  submitForm(): void {
    this.isSubmitted = true;
    this.isSubmitting = true;
    if (this.cvForm.valid) {
      if (this.cvId) {
        // Update existing CV
        this.cvService.updateCv(this.cvId, this.cvForm.value).subscribe({
          next: () => alert('CV updated successfully!'),
          error: (err) => alert('Error updating CV'),
          complete: () => (this.isSubmitting = false)
        });
      } else {
        // Create new CV
        this.cvService.saveCv(this.cvForm.value).subscribe({
          next: () => alert('CV created successfully!'),
          error: (err) => alert('Error creating CV'),
          complete: () => (this.isSubmitting = false)
        });
      }
    } else {
      this.isSubmitting = false;
    }
  }

  get workExperience() {
    return this.cvForm.get('workExperience') as FormArray;
  }

  get education() {
    return this.cvForm.get('education') as FormArray;
  }

  addWorkExperience() {
    this.workExperience.push(this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      duration: ['', Validators.required]
    }));
  }

  removeWorkExperience(index: number) {
    this.workExperience.removeAt(index);
  }

  addEducation() {
    this.education.push(this.fb.group({
      school: ['', Validators.required],
      degree: ['', Validators.required],
      year: ['', Validators.required]
    }));
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }



}
