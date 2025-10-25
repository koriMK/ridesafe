from twilio.rest import Client
import os

def send_otp(phone_number, otp_code):
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    twilio_phone = os.getenv('TWILIO_PHONE_NUMBER')
    
    if not all([account_sid, auth_token, twilio_phone]):
        print(f"SMS not sent - missing Twilio config. OTP: {otp_code}")
        return False
    
    try:
        client = Client(account_sid, auth_token)
        
        message = client.messages.create(
            body=f"Your SafeRide verification code is: {otp_code}. Valid for 5 minutes.",
            from_=twilio_phone,
            to=phone_number
        )
        
        print(f"SMS sent successfully. SID: {message.sid}")
        return True
        
    except Exception as e:
        print(f"Failed to send SMS: {str(e)}")
        print(f"OTP for {phone_number}: {otp_code}")
        return False