from datetime import datetime, timedelta

def get_next_billing_date(frequency):
    now = datetime.utcnow()

    if frequency == "daily":
        return now + timedelta(days=1)
    elif frequency == "weekly":
        return now + timedelta(weeks=1)
    elif frequency == "monthly":
        return now + timedelta(days=30)

    return None