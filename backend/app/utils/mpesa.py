import requests
import base64
from datetime import datetime
import os

def get_mpesa_access_token():
    consumer_key = os.getenv('MPESA_CONSUMER_KEY')
    consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
    
    if not consumer_key or not consumer_secret:
        raise Exception("M-Pesa credentials not configured")
    
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    credentials = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()
    headers = {"Authorization": f"Basic {credentials}"}
    
    try:
        response = requests.get(api_url, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        if 'access_token' not in data:
            raise Exception(f"M-Pesa auth failed: {data}")
            
        return data['access_token']
    except requests.exceptions.RequestException as e:
        raise Exception(f"M-Pesa API error: {str(e)}")

def initiate_stk_push(phone_number, amount, account_reference):
    try:
        access_token = get_mpesa_access_token()
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        
        business_short_code = os.getenv('MPESA_BUSINESS_SHORTCODE')
        passkey = os.getenv('MPESA_PASSKEY')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(f"{business_short_code}{passkey}{timestamp}".encode()).decode()
        
        # Format phone number (remove + and ensure 254 prefix)
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]
        if not phone_number.startswith('254'):
            phone_number = '254' + phone_number.lstrip('0')
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(float(amount)),
            "PartyA": phone_number,
            "PartyB": business_short_code,
            "PhoneNumber": phone_number,
            "CallBackURL": os.getenv('MPESA_CALLBACK_URL'),
            "AccountReference": f"SafeRide-{account_reference}",
            "TransactionDesc": "SafeRide trip payment"
        }
        
        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
        
    except Exception as e:
        return {"errorCode": "500", "errorMessage": str(e)}

def query_payment_status(checkout_request_id):
    try:
        access_token = get_mpesa_access_token()
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        
        business_short_code = os.getenv('MPESA_BUSINESS_SHORTCODE')
        passkey = os.getenv('MPESA_PASSKEY')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(f"{business_short_code}{passkey}{timestamp}".encode()).decode()
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }
        
        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
        
    except Exception as e:
        return {"ResultCode": "1", "ResultDesc": str(e)}