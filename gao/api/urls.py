from django.urls import path, include 
from .views import * 



urlpatterns = [
    path("users/", UserListView.as_view()),
    path("users/<pk>/", UserDetailView.as_view()),
    path("users/<faculty>/", AdvocateListView.as_view()),
    path("users_date/", advocat_busy_days),

    path("consultations/", ConsultationListView.as_view()),
    path("consultations/<pk>/", ConsultationDetailView.as_view()),

    path("consultation_documents/", ConsultationDocumentListView.as_view()),
    path("consultation_documents/<pk>/", ConsultationDocumentDetailView.as_view()),

    path("consultation_payments/", ConsultationPaymentListView.as_view()),
    path("consultation_payments/<pk>/", ConsultationPaymentDetailView.as_view()),

    path("faculties/", FacultyListView.as_view()),
    path("faculties/<pk>/", FacultyDetailView.as_view()),
]


