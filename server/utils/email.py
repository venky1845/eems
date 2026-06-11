import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

MAIL_FROM     = "venky994907@gmail.com"
MAIL_USERNAME = "venky994907@gmail.com"
MAIL_PASSWORD = "vedmaughbaqwbzep"
MAIL_SERVER   = "smtp.gmail.com"
MAIL_PORT     = 587


def send_reset_email(to_email: str, reset_link: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Password Reset Request"
    msg["From"]    = MAIL_FROM
    msg["To"]      = to_email

    html = f"""
    <p>Hi,</p>
    <p>Click the link below to reset your password. This link expires in <b>30 minutes</b>.</p>
    <p><a href="{reset_link}">Reset Password</a></p>
    <p>If you did not request this, you can safely ignore this email.</p>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_FROM, to_email, msg.as_string())