import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime

class ExternalApiClient:
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        """
        Initialize the external API client
        
        Args:
            base_url (str): Base URL of the external API
            api_key (str, optional): API key for authentication
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()
        
        # Set up authentication headers if API key is provided
        if self.api_key:
            self.session.headers.update({
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            })
    
    def create_customer(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send customer data to external API
        
        Args:
            customer_data (dict): Customer information
            
        Returns:
            dict: Response from the external API
        """
        try:
            # Add timestamp to customer data
            customer_data['created_at'] = datetime.now().isoformat()
            
            response = self.session.post(
                f"{self.base_url}/customers",
                json=customer_data,
                timeout=30
            )
            
            # Raise an exception for bad status codes
            response.raise_for_status()
            
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error sending customer data to external API: {e}")
            raise
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON response: {e}")
            raise
    
    def update_customer(self, customer_id: int, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update customer data in external API
        
        Args:
            customer_id (int): ID of the customer
            customer_data (dict): Updated customer information
            
        Returns:
            dict: Response from the external API
        """
        try:
            response = self.session.put(
                f"{self.base_url}/customers/{customer_id}",
                json=customer_data,
                timeout=30
            )
            
            response.raise_for_status()
            
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error updating customer data in external API: {e}")
            raise
    
    def delete_customer(self, customer_id: int) -> Dict[str, Any]:
        """
        Delete customer from external API
        
        Args:
            customer_id (int): ID of the customer to delete
            
        Returns:
            dict: Response from the external API
        """
        try:
            response = self.session.delete(
                f"{self.base_url}/customers/{customer_id}",
                timeout=30
            )
            
            response.raise_for_status()
            
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error deleting customer from external API: {e}")
            raise

# Example usage
if __name__ == "__main__":
    # Initialize the client with your external API details
    # Replace with your actual API URL and key
    client = ExternalApiClient(
        base_url="https://your-external-api.com/api",
        api_key="your-api-key-here"
    )
    
    # Example customer data
    customer_data = {
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "(555) 123-4567",
        "totalVisits": 0,
        "totalSpent": 0,
        "favoriteItems": [],
        "lastVisit": datetime.now().date().isoformat(),
        "membership": "regular"
    }
    
    try:
        # Send customer data to external API
        result = client.create_customer(customer_data)
        print("Customer created successfully:", result)
    except Exception as e:
        print(f"Failed to create customer: {e}")