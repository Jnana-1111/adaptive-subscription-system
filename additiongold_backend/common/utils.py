def get_user_type(subscription_count):
    if subscription_count >= 5:
        return "gold"
    elif subscription_count >= 3:
        return "silver"
    return "normal"


def get_discount(user_type):
    if user_type == "gold":
        return 20
    elif user_type == "silver":
        return 10
    return 5