import { Component, OnInit } from '@angular/core';
import { CvService } from '../../core/services/cv.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  professionalSummary: string;
  skills: string;
  dateAdded: Date;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'dateAdded', 'actions'];
  users: User[] = [];
  editForm!: FormGroup;
  selectedUser: User | null = null;
  isModalOpen = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 10;


  constructor(
    private cvService: CvService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.initForm();
  }

  fetchUsers(): void {
    this.cvService.getAllCvs().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      professionalSummary: [''],
      skills: ['']
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      professionalSummary: user.professionalSummary,
      skills: user.skills
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  updateUser(): void {
    if (this.editForm.valid && this.selectedUser) {
      const updatedData = this.getUpdatedData();

      // Send only the modified fields to the backend
      this.cvService.updateCv(this.selectedUser.id, updatedData).subscribe({
        next: (updatedCv) => {
          alert('User updated successfully!');
          this.fetchUsers(); // Refresh the user list
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Error updating CV. Please try again.');
        }
      });
    }
  }

  // Function to compare and return only modified fields
  getUpdatedData(): any {
    const updatedData: any = {};
    const formValues = this.editForm.value;

    Object.keys(formValues).forEach((key) => {
      if (this.selectedUser && this.selectedUser.hasOwnProperty(key)) {
        if (this.selectedUser[key as keyof User] !== formValues[key]) {
          updatedData[key] = formValues[key];
        }
      }
    });

    return updatedData;
  }


  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this CV?')) {
      this.cvService.deleteCv(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.fetchUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
  }

  generateCv(id: number): void {
    this.cvService.generateCvPdf(id).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
        alert('Failed to generate CV PDF.');
      }
    });
  }

  onPaginateChange(event: any): void {
    this.pageSize = event.pageSize;
    console.log(`Page changed to: ${event.pageIndex + 1}, Page size: ${event.pageSize}`);
  }


}

