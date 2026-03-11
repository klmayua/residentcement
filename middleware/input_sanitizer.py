"""
Input Sanitization Middleware for ResidentCement Project
Addresses: Critical 'Input Validation' finding from forensic audit (forensics1032026)

Usage:
    @sanitize_input
    def user_endpoint(user_input):
        # Input is automatically sanitized
        pass
"""

import re
from functools import wraps
from typing import Any, Callable, Union


def sanitize_input(func: Callable) -> Callable:
    """
    Atomic deterministic input sanitization decorator.
    Removes: script tags, SQL metachars, path traversal, XSS vectors
    """
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        # Sanitization function: remove dangerous characters
        def clean(value: Any) -> Any:
            if not isinstance(value, str):
                return value
            
            # Remove script tags
            value = re.sub(r'<script[^>]*>.*?</script>', '', value, flags=re.IGNORECASE | re.DOTALL)
            
            # Remove SQL metachars that could enable injection
            value = re.sub(r'(--|#|/\*|\*/|;|\'|")', '', value)
            
            # Remove path traversal attempts
            value = re.sub(r'\.\./|\.\.\\', '', value)
            
            # Remove XSS vectors
            value = re.sub(r'<[^>]*>', '', value)
            
            # Remove shell injection chars
            value = re.sub(r'[`$(){}|&;\n\r]', '', value)
            
            return value.strip()
        
        # Sanitize all string arguments
        sanitized_args = tuple(clean(arg) for arg in args)
        sanitized_kwargs = {k: clean(v) for k, v in kwargs.items()}
        
        return func(*sanitized_args, **sanitized_kwargs)
    
    return wrapper


def sanitize_dict(data: dict) -> dict:
    """Sanitize all string values in a dictionary"""
    result = {}
    for key, value in data.items():
        if isinstance(value, str):
            # Apply same sanitization as decorator
            value = re.sub(r'<script[^>]*>.*?</script>', '', value, flags=re.IGNORECASE | re.DOTALL)
            value = re.sub(r'(--|#|/\*|\*/|;|\'|")', '', value)
            value = re.sub(r'\.\./|\.\.\\', '', value)
            value = re.sub(r'<[^>]*>', '', value)
            value = re.sub(r'[`$(){}|&;\n\r]', '', value)
            result[key] = value.strip()
        elif isinstance(value, dict):
            result[key] = sanitize_dict(value)
        elif isinstance(value, list):
            result[key] = [sanitize_dict(item) if isinstance(item, dict) else item for item in value]
        else:
            result[key] = value
    return result


# Export for middleware usage
__all__ = ['sanitize_input', 'sanitize_dict']
