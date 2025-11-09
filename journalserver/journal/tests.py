from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import JournalEntry

class JournalEntryModelTest(TestCase):

    # Create a journal entry object 
    def test_create_journal_entry(self):
        entry = JournalEntry.objects.create(
            title="Test Entry",
            content="Testing TDD setup."
        )
        self.assertEqual(entry.title, "Test Entry")
        self.assertEqual(entry.content, "Testing TDD setup.")

class JournalEntryAPITest(APITestCase):

    # API Entries endpoint returns real database entry data
    def test_get_entries_returns_data(self):
        
        # Create sample entries in the database
        JournalEntry.objects.create(title="Entry 1", content="First test entry")
        JournalEntry.objects.create(title="Entry 2", content="Second test entry")

        # Send GET request to the API endpoint
        url = reverse('entry-list')  # we’ll define this name in urls.py
        response = self.client.get(url)

        # Check that response returns the entries
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["entries"]), 2)
        self.assertEqual(response.data["entries"][0]["title"], "Entry 1")

    # POST Endpoint allows frontend to create new entries
    def test_create_entry_via_post(self):
        url = reverse('entry-list')
        data = {
            "title": "New Post",
            "content": "Testing POST request through API"
        }

        response = self.client.post(url, data, format='json')

        # Expect a successful creation (201 Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that exactly one entry exists in the DB now
        self.assertEqual(JournalEntry.objects.count(), 1)

        # Verify the content of the entry
        entry = JournalEntry.objects.first()
        self.assertEqual(entry.title, "New Post")
        self.assertEqual(entry.content, "Testing POST request through API")