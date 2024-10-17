import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  receiptData: any;
  selectedFile: File | null = null;
  filePath:any;
  errorMessage: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      console.log(formData);

      this.http.post<any>('http://127.0.0.1:8000/upload_receipt/', formData)
        .subscribe((response) => {
          if (response.hasOwnProperty('temp_file_path')) {
            this.filePath = `http://127.0.0.1:8000/${response.temp_file_path}`;
            this.errorMessage = null;
          } 
          this.receiptData = response;
        }, (error) => {
          this.errorMessage = 'Error uploading file. Please try again.';  
          this.snackBar.open(this.errorMessage, 'Close', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['error-snackbar']  // Optional: Define a CSS class for custom styling
          });
          console.error('Error uploading file:', error);
        });
    }
  }
}
