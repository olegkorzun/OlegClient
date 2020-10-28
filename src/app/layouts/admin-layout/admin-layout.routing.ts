import { Routes } from '@angular/router';
import { AuthGuard } from 'app/auth.guard';

import { FlowComponent } from 'app/pages/flow/flow.component';
import { MessageComponent } from 'app/pages/message/message.component';
import { TicketComponent } from 'app/pages/ticket/ticket.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { PersonComponent } from 'app/pages/person/person.component';
import { ActionComponent  } from 'app/pages/action/action.component';
import { ApointmentComponent } from 'app/pages/actionnew/apointment.component';
import { ContractNewComponent  } from 'app/pages/actionnew/contractnew.component';
import { NotRelevantComponent  } from 'app/pages/actionnew/notrelevant.component';
import { TaskComponent  } from 'app/pages/actionnew/task.component';


export const AdminLayoutRoutes: Routes = [
    { 
        path: 'login',          
        component: LoginComponent 
    },
    { 
        path: 'ticket',        
        component: TicketComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'message',        
        component: MessageComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'flow',          
        component: FlowComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'dashboard',          
        component: DashboardComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'person',  
        component: PersonComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'action',  
        component: ActionComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'apointment',  
        component: ApointmentComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'contractnnew',  
        component: ContractNewComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'notrelevant',  
        component: NotRelevantComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'task',  
        component: TaskComponent , 
        canActivate: [AuthGuard] 
    },

    
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
];
