class TokenNotFoundError(Exception):
    """
    Custom exception raised when a token is not found in the database.
    """

    def __init__(self, token_jti, message=None):
        """
        Initialize the TokenNotFoundError exception.

        Args:
            token_jti (str): The unique identifier (jti) of the token.
            message (str, optional): Custom error message. Defaults to None.
        """
        if message is None:
            message = f"Token with jti '{token_jti}' not found in the database."
        super().__init__(message)
        self.token_jti = token_jti