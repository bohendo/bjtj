
# Hash Functions: A simple intro

### Last Updated on August 4th, 2017 by Bo Henderson

The purpose of this article is to describe what a hash function does to someone with zero prior cryptography knowledge

# Summary

A hash function has a two important properties:

 - The output appears to be completely random
 - The same input value always returns the same output

# Simple Example

Imagine this stupidly simple hash function:

 - multiply a given number by 123
 - extract the last 3 digits of the result
 - Do this a couple more times with a couple different numbers (eg 456 and 789)

So to hash a PIN of 1234 we would say:

 - 1234 * 123 = 151782
 - last 3 digits = 782
 - 782 * 456 = 356592
 - last 3 digits = 592
 - 592 * 789 = 467088
 - last 3 digits = 088

So, using the above algorithm, we'd say the hash of 1234 is 088

Let's define this using a python function so we can easily run this calculation on several examples. Understanding this python isn't important, just know that this function automates the above calculations.

```python

def hash(n):

    # multiply our input by 123
    temp = n * 123

    # extract the last 3 digits of the result
    temp = int(str(temp)[len(str(temp))-3:])

    # repeat the above two steps with a couple more numbers
    temp = temp * 456
    temp = int(str(temp)[len(str(temp))-3:])
    temp = temp * 789
    temp = str(temp)[len(str(temp))-3:]

    # print out our final result
    print temp

```

Now, we can use this simple hash function as follows:

```python
>>> hash(1)
432
>>> hash(2)
864
>>> hash(3)
296
```

This simple hash function has a few important properties:
 
 - The output doesn't tell us much about the input. We discard information at several points so reverse-engineering the function isn't easy.
 - The same input will always generate the same output. Even though the output is designed to appear random, no random numbers are actually used.

## Hashes applied to secure password storage

Let's say I run a website and you need a PIN to login. Maybe you choose a PIN of 1234. Now, my database of usernames and credentials *should* stay out sight of bad guys but hey, people get hacked sometimes. If I get hacked then I don't want the hacker to get everyone's PINs so, instead of storing your PIN, I'll instead store a hash of your PIN.

```python
>>> hash(1234)
088
```

I store 088 in my database right next to your username so now, when you enter your PIN to login, I hash it and compare that to the hash I have saved. If they're the same, I let you in. Otherwise, try again.

Later on, I'm clicking on ads and plugging random USB drives into my computer and darn. I get hacked and some intruder just got access to my entire database. But your account is not necessarily compromised because I don't actually store your PINs, I just store the hashes.

The intruder now knows that your PIN is something that hashes to 088 but they don't actually know your PIN. They can start testing random PINs against my hashing algorithms and eventually they might 'crack' your password if they find one with the same hash. But if your PIN is hard to guess and my hash function is secure (spoiler alert: this one definitely is not), then your account will remain secure despite the database breach.

How useful!

## Hashes applied to bitcoin mining

**Proof of work** is an extremely important idea that lies at the heart of bitcoin's security model. The big idea is that you want to force someone to do a huge amount of computational work but you want an easy way to verify it. A sudoku is a great example of a human-version of proof of work. It takes a long time to solve a sudoku puzzle but once you do, it's very easy to verify that it's been solved correctly.

A hash function is at the heart of bitcoin's proof of work. The idea is this: to mine a bundle of transactions, you have to find a hash that starts with a certain number of zeros. Because hash functions are designed to produce complete random output for any given input, the only way to accomplish this is by guessing and checking.

For example, if we wanted to use our simple hash function to mine a hash that starts with 1 zero we could do something like this:

```python
>>> hash(1)
432
>>> hash(2)
864
>>> hash(3)
296
>>> hash(4)
728
>>> hash(5)
160
>>> hash(6)
592
>>> hash(7)
024
```

Success! Now we can provide the number 7 and our hash function to someone else and they can see for themselves that the hash starts with a 0. By doing this, they can confirm the work we did in a single step. If we want to solve a harder problem, we can find a hash that starts with 2 zeros, etc.

This is the same process as in bitcoin mining except what we're hashing is a bundle of transactions. This means that if a single transaction is changed, the hash of the entire bundle changes and we need to start guessing and checking again to find the particular input that produces a hash that starts with some number of zeros.

## Security Considerations

Notice the following example:

```python
>>> hash(1000)
000
>>> hash(2000)
000
```

This is called a hash collision and is a big no-no when designing secure hashing algorithms. In the real world, hashing algorithms are graded on how hard it is to find a hash collision. Mine would score an F based on the simplicity of the above collision but SHA256 would get an A.

If we upgrade from our previous hash function to SHA256, then the hash collision disappears:

```bash
$ sha256sum <<< "1000"
83c02ac2d48c863dab2ccf6870455aadfc2cec073b8db269b517c879d76aa6d9  -

$ sha256sum <<< "2000"
1d8fa3c8ab49d50b30fccbbd901735d5896a5d7959a5ad7ccecb79c1c849cc66  -
```

Where our simple example of a hash function had 999 different outputs, SHA256 has 2^256 different outputs, a [staggeringly large number](https://www.youtube.com/watch?v=S9JGmA5_unY) of possibilities. Finding a hash collision for SHA256 would take a lot of guessing & checking: more than the all the computers in existence working constantly for longer than the lifetime of the universe.

