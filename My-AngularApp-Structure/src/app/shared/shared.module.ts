import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomDirectiveDirective } from './directives/custom-directive.directive';
import { CapitalizePipe } from './pipes/capitalize.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CustomDirectiveDirective,
    CapitalizePipe
  ], // Declaring Shared components, directives, and pipes
  imports: [CommonModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    CustomDirectiveDirective,
    CapitalizePipe
  ], // Exporting shared components, directives, and pipes
})
export class SharedModule {}