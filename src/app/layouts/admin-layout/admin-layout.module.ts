import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* material */
import {BidiModule} from '@angular/cdk/bidi';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';


/* fullcalendar */
import { FullCalendarModule } from '@fullcalendar/angular';
/* application elements */
import { ModalModule } from 'app/components/modal/modal.module';
import { FlowComponent } from 'app/pages/flow/flow.component';
import { MessageComponent } from 'app/pages/message/message.component';
import { TicketComponent } from 'app/pages/ticket/ticket.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { PersonComponent } from 'app/pages/person/person.component';
import { ActionTypeComponent } from 'app/pages/person/actiontype.component';
import { ActionsComponent } from 'app/pages/person/actions.component';
import { ActionCreateComponent } from 'app/pages/person/actioncreate.component';
import { ActionStatusComponent } from 'app/pages/person/actionstatus.component';
import { ContractNewComponent  } from 'app/pages/actionnew/contractnew.component';
import { ActionComponent  } from 'app/pages/action/action.component';
import { ApointmentComponent } from 'app/pages/actionnew/apointment.component';
import { NotRelevantComponent  } from 'app/pages/actionnew/notrelevant.component';
import { TaskComponent  } from 'app/pages/actionnew/task.component';

@NgModule({ 
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    FullCalendarModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatTabsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatChipsModule,
    OverlayModule,

A11yModule,
ClipboardModule,
DragDropModule,
PortalModule,
ScrollingModule,
CdkStepperModule,
CdkTableModule,
CdkTreeModule,
MatAutocompleteModule,
MatButtonToggleModule,
MatStepperModule,
MatDatepickerModule,
MatDialogModule,
MatDividerModule,
MatExpansionModule,
MatGridListModule,
MatListModule,
MatMenuModule,
MatNativeDateModule, 
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
MatSidenavModule,
MatSliderModule,
MatSnackBarModule,
MatSortModule,
MatToolbarModule,
MatTreeModule,
OverlayModule,
BidiModule,
  ],
  declarations: [
    LoginComponent,
    FlowComponent,
    MessageComponent,
    TicketComponent,
    DashboardComponent,
    PersonComponent,
    ActionTypeComponent,
    ActionsComponent,
    ActionCreateComponent,
    ActionStatusComponent,
    ContractNewComponent,
    ActionComponent,
    ApointmentComponent,
    NotRelevantComponent,
    TaskComponent,
  ]
})

export class AdminLayoutModule {}
